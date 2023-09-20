import { TestBed } from "@angular/core/testing";

import { SelectionStartCommand } from "./selection-start-command.service";

describe("SelectionStartCommand", () => {
  let service: SelectionStartCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionStartCommand);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
