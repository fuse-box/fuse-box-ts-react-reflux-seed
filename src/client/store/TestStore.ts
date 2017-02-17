import * as Reflux from "reflux";
import * as React from "react";
import Actions from "../actions";

export class TestStore extends Reflux.Store {
    private listenables = Actions;
    // typescript just relax okay?
    private setState: any;
    private state = {
        counter: 0
    }

    private onIncrementSomething() {
        this.setState({
            counter: ++this.state.counter
        });
    }
}
