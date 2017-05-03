import * as Reflux from "reflux";
import * as React from "react";
import Actions from "../actions";
import { TestStore } from '../store/TestStore';
declare const FuseBox: any;

export interface IHelloWorldProps { }
export class HelloWorld extends Reflux.Component<IHelloWorldProps, any> {
    private store = TestStore;
    private props: any;
    public setState: any;
    private state: any;
    public render() {
        // this only shows that initially the inport does not exist
        // but after pressing the button it will exists as it will be cached



        return (
            <button onClick={() => {
                Actions.incrementSomething();

            }}
                className="btn btn-primary" type="button">
                Message increment<span className="badge">{this.state.counter}</span>
            </button>
        );
    }
}
