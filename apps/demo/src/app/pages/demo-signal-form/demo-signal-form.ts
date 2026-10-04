import { Component, computed, effect, signal } from '@angular/core';
import { applyEach, email, form, FormField, minLength, required } from '@angular/forms/signals';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { Country, CountryCombobox } from './country-combobox/country-combobox';
import { TitleSelect, TravelerTitle } from './title-select/title-select';
import { SelectedUser, UserSelection } from './user-selection/user-selection';

hljs.registerLanguage('json', json);

interface Traveler {
  title: TravelerTitle;
  user: SelectedUser | null;
}

@Component({
  selector: 'app-demo-signal-form-page',
  imports: [FormField, UserSelection, TitleSelect, CountryCombobox],
  templateUrl: './demo-signal-form.html',
})
export class DemoSignalFormPage {
  readonly flightModel = signal({
    email: '',
    from: null as Country | null,
    to: null as Country | null,
    departureDate: new Date(),
    returnDate: new Date(),
    travelers: [{ title: 'Mr', user: { userId: 2, userName: 'Michael Williams' } }] as Traveler[],
  });

  readonly highlightedFlightModel = computed(
    () => hljs.highlight(JSON.stringify(this.flightModel(), null, 2), { language: 'json', ignoreIllegals: true }).value,
  );

  readonly flightForm = form(this.flightModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.from, { message: 'Departure is required' });
    required(schemaPath.to, { message: 'Destination is required' });
    required(schemaPath.departureDate, { message: 'Departure date is required' });
    required(schemaPath.returnDate, { message: 'Return date is required' });
    minLength(schemaPath.travelers, 1, { message: 'Travelers are required' });
    applyEach(schemaPath.travelers, (traveler) => {
      required(traveler.user, { message: 'Select a user' });
    });
  });

  addTraveler() {
    this.flightForm.travelers().value.update((travelers) => [...travelers, { title: 'Mr', user: null }]);
  }

  removeTraveler(index: number) {
    this.flightForm.travelers().value.update((travelers) => travelers.filter((_, travelerIndex) => travelerIndex !== index));
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  log = effect(() => {
    console.log('Flight model:', this.flightModel());
  });
}
