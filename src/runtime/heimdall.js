import Session from './session';
import now from './time';
import EmptyObject from './empty-object';
import { NULL_NUMBER } from './counter-store';

// op codes
const OP_START = 0;
const OP_STOP = 1;
const OP_RESUME = 2;
const OP_ANNOTATE = 3;

export default class Heimdall{
  constructor(session) {
    if (arguments.length < 1) {
      session = new Session();
    }

    this._session = session;
  }

  get _monitors() {
    return this._session._monitors;
  }

  get _events() {
    return this._session._events;
  }

  _retrieveCounters() {
    return this._monitors.cache();
  }

  start(name) {
    this._events.push([OP_START, name, now(), this._retrieveCounters()]);

    return this._events.length - 1;
  }

  stop(token) {
    this._events.push([OP_STOP, token, now(), this._retrieveCounters()]);
  }

  resume(token) {
    this._events.push([OP_RESUME, token, now(), this._retrieveCounters()]);
  }

  annotate(info) {
    // This has the side effect of making events heterogenous, as info is an object
    // while counters will always be `null` or an `Array`
    this._events.push([OP_ANNOTATE, NULL_NUMBER, NULL_NUMBER, info]);
  }

  registerMonitor(name, ...keys) {
    if (name === 'own' || name === 'time') {
      throw new Error('Cannot register monitor at namespace "' + name + '".  "own" and "time" are reserved');
    }
    if (this._monitors.has(name)) {
      throw new Error('A monitor for "' + name + '" is already registered"');
    }

    return this._monitors.registerNamespace(name, keys);
  }

  increment(token) {
    this._monitors.increment(token);
  }

  configFor(name) {
    let config = this._session.configs.get(name);

    if (!config) {
      config = this._session.configs.set(name, new EmptyObject());
    }

    return config;
  }

  toJSON() {
    throw new Error('TODO, implement');
  }

  visitPreOrder(cb) {
    throw new Error('TODO, implement');
  }

  visitPostOrder(cb) {
    throw new Error('TODO, implement');
  }

  generateNextId() {
    return this._session.generateNextId();
  }
}