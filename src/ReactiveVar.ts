import Dependency from "./core/Dependency";

export class ReactiveVar<T> {
  private _value: T;
  private _dependency: Dependency;

  constructor(initialValue: T) {
    this._value = initialValue;
    this._dependency = new Dependency();
  }

  get() {
    this._dependency.depend();
    return this._value;
  }

  set(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._dependency.changed();
    }
  }
}
