interface BooleanDictionary {
    [key: string]: boolean;
  }

  declare let myDict: BooleanDictionary;

  // Error, "oops" isn't a boolean
  myDict["baz"] = "oops";
