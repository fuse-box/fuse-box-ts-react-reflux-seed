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
        return (
            <button onClick={() => Actions.incrementSomething()}
                className="btn btn-primary" type="button">
                Message increment <span className="badge">{this.state.counter}</span>
            </button>
        );
    }
}
