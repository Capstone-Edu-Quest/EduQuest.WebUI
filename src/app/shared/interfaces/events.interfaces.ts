export class EventBase {
  name: string;
  obj: any;

  constructor(obj: any) {
    this.name = this.constructor.name;
    this.obj = obj;
  }
}

export class EventTest extends EventBase {
  age: number;
  school: string;

  constructor(age: number, school: string) {
    super({ age, school });
    this.age = age;
    this.school = school;
  }
}
