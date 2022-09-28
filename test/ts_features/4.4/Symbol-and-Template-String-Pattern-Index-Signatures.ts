interface BooleanDictionary {
    [key: string]: boolean;
}

declare let myDict: BooleanDictionary;

// Valid to assign boolean values
myDict["foo"] = true;
myDict["bar"] = false;
