import * as Reflux from "reflux";
import * as React from "react";
import Actions from "../actions";
import { TestStore } from '../store/TestStore';

export interface IHelloWorldProps { }
export class HelloWorld extends Reflux.Component<IHelloWorldProps, any> {
    private store = TestStore;
    private props: any;
    private state: any;
    public render() {
        // this only shows that initially the inport does not exist
        // but after pressing the button it will exists as it will be cached
        try {
            const initLazy = FuseBox.import("../lazy"); // will be null
            console.log('Currently lazy is: ' + initLazy);
        } catch (_ex) { /**/ }

        return (
            <button onClick={() => {
                Actions.incrementSomething();

                // example of lazy load
                FuseBox.import("./bundles/lazy.js", (module) => {
                    const lazy = FuseBox.import("../lazy").default;
                    lazy();
                })
            }}
                className="btn btn-primary" type="button">
                Message increment <span className="badge">{this.state.counter}</span>
            </button>
        );
    }
}
