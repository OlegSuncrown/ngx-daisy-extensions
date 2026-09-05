#!/usr/bin/env node

import { constants } from 'node:fs';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONFIG_FILE = 'daisy-extensions.json';
const DEFAULT_COMPONENTS_PATH = 'src/app/daisy-extensions';
const PUBLIC_COMPONENTS = ['select', 'combobox'];
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryRoot = resolve(packageRoot, 'registry');

function printHelp() {
  console.log(`ngx-daisy-extensions

Usage:
  ngx-daisy-extensions init [--directory <path>] [--overwrite]
  ngx-daisy-extensions add <component...> [--overwrite] [--dry-run]
  ngx-daisy-extensions add --all [--overwrite] [--dry-run]
  ngx-daisy-extensions list

Components:
  ${PUBLIC_COMPONENTS.join(', ')}
`);
}

function parseArguments(args) {
  const positional = [];
  const options = { all: false, dryRun: false, overwrite: false };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--all') options.all = true;
    else if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--overwrite') options.overwrite = true;
    else if (argument === '--directory' || argument === '-d') {
      const value = args[index + 1];
      if (!value || value.startsWith('-'))
        throw new Error(`${argument} requires a path.`);
      options.directory = value;
      index += 1;
    } else if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument.startsWith('-'))
      throw new Error(`Unknown option: ${argument}`);
    else positional.push(argument);
  }

  return { positional, options };
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveProjectPath(projectRoot, configuredPath) {
  if (!configuredPath?.trim())
    throw new Error('The component directory cannot be empty.');
  if (isAbsolute(configuredPath))
    throw new Error(
      'The component directory must be relative to the project root.',
    );

  const absolutePath = resolve(projectRoot, configuredPath);
  const relativePath = relative(projectRoot, absolutePath);
  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)
  ) {
    throw new Error(
      'The component directory must stay inside the project root.',
    );
  }
  return absolutePath;
}

async function promptForDirectory() {
  if (!process.stdin.isTTY) return DEFAULT_COMPONENTS_PATH;

  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = await prompt.question(
      `Component directory (${DEFAULT_COMPONENTS_PATH}): `,
    );
    return answer.trim() || DEFAULT_COMPONENTS_PATH;
  } finally {
    prompt.close();
  }
}

async function init(projectRoot, options) {
  const configPath = resolve(projectRoot, CONFIG_FILE);
  if ((await exists(configPath)) && !options.overwrite) {
    throw new Error(
      `${CONFIG_FILE} already exists. Use --overwrite to replace it.`,
    );
  }

  const componentsPath =
    options.directory?.trim() || (await promptForDirectory());
  resolveProjectPath(projectRoot, componentsPath);

  const config = {
    $schema: 'https://unpkg.com/ngx-daisy-extensions/schema.json',
    componentsPath: componentsPath.replaceAll('\\', '/').replace(/\/$/, ''),
  };

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  console.log(`Created ${CONFIG_FILE}.`);
  console.log(`Components will be added to ${config.componentsPath}.`);
}

async function readJson(path, description) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    throw new Error(
      `Could not read ${description} at ${path}: ${error.message}`,
    );
  }
}

function resolveRegistryItems(registry, requested) {
  const resolved = [];
  const visited = new Set();

  function visit(name) {
    if (visited.has(name)) return;
    const item = registry.items[name];
    if (!item)
      throw new Error(
        `Unknown component "${name}". Available: ${PUBLIC_COMPONENTS.join(', ')}`,
      );

    visited.add(name);
    for (const dependency of item.registryDependencies ?? []) visit(dependency);
    resolved.push({ name, ...item });
  }

  for (const name of requested) visit(name);
  return resolved;
}

async function warnAboutDependencies(projectRoot) {
  const packageJsonPath = resolve(projectRoot, 'package.json');
  if (!(await exists(packageJsonPath))) return;

  const packageJson = await readJson(packageJsonPath, 'package.json');
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  const required = ['@angular/aria', '@angular/cdk', 'daisyui', 'tailwindcss'];
  const missing = required.filter((dependency) => !dependencies[dependency]);
  if (missing.length)
    console.warn(`Missing project dependencies: ${missing.join(', ')}`);
}

async function add(projectRoot, requested, options) {
  const configPath = resolve(projectRoot, CONFIG_FILE);
  if (!(await exists(configPath)))
    throw new Error(
      `Run "ngx-daisy-extensions init" first; ${CONFIG_FILE} was not found.`,
    );

  const config = await readJson(configPath, CONFIG_FILE);
  const destinationRoot = resolveProjectPath(
    projectRoot,
    config.componentsPath,
  );
  const registry = await readJson(
    resolve(registryRoot, 'registry.json'),
    'component registry',
  );
  const names = options.all ? PUBLIC_COMPONENTS : requested;
  if (!names.length)
    throw new Error(
      `Choose a component: ${PUBLIC_COMPONENTS.join(', ')}, or use --all.`,
    );

  const items = resolveRegistryItems(registry, names);
  const files = [...new Set(items.flatMap((item) => item.files))];
  let written = 0;
  let unchanged = 0;
  let skipped = 0;

  for (const file of files) {
    const source = resolve(registryRoot, file);
    const destination = resolve(destinationRoot, file);
    if (
      !relative(registryRoot, source) ||
      relative(registryRoot, source).startsWith('..')
    ) {
      throw new Error(`Invalid registry file path: ${file}`);
    }

    if (await exists(destination)) {
      const [sourceContent, destinationContent] = await Promise.all([
        readFile(source),
        readFile(destination),
      ]);
      if (sourceContent.equals(destinationContent)) {
        unchanged += 1;
        continue;
      }
      if (!options.overwrite) {
        console.warn(
          `Skipped modified file ${relative(projectRoot, destination)}.`,
        );
        skipped += 1;
        continue;
      }
    }

    if (!options.dryRun) {
      await mkdir(dirname(destination), { recursive: true });
      await copyFile(source, destination);
    }
    console.log(
      `${options.dryRun ? 'Would add' : 'Added'} ${relative(projectRoot, destination)}.`,
    );
    written += 1;
  }

  console.log(
    `${options.dryRun ? 'Previewed' : 'Finished'}: ${written} added, ${unchanged} unchanged, ${skipped} skipped.`,
  );
  await warnAboutDependencies(projectRoot);
}

async function main() {
  const [command, ...rawArguments] = process.argv.slice(2);
  const { positional, options } = parseArguments(rawArguments);

  if (!command || command === 'help' || options.help) {
    printHelp();
    return;
  }

  const projectRoot = process.cwd();
  if (command === 'init') await init(projectRoot, options);
  else if (command === 'add') await add(projectRoot, positional, options);
  else if (command === 'list') console.log(PUBLIC_COMPONENTS.join('\n'));
  else throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
