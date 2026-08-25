import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, type GraphNode, ReducedValue } from "@langchain/langgraph";
import {z} from 'zod'

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    judge_recommndation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0
    }), {
        reducer: (current, next) => {
            return next
        }
    })
});

const solutionNode: GraphNode<typeof State> = (state: typeof State.State) => {
    // `state.messages` contains everything accumulated so far,
    // including the message passed in when we invoked the graph below.
    console.log(state.messages);

    // Returning messages APPENDS them to the existing list
    // (that's MessagesValue's built-in merge behavior).
    return {
        messages: [new HumanMessage("This is the Solution")]
    };
};

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addEdge(START, "solution")
    .addEdge("solution", END)
    .compile();


export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            // HumanMessage represents a message from the user.
            // (Other types exist: AIMessage, SystemMessage, ToolMessage...)
            new HumanMessage(userMessage)
        ]
    });

    // result = final state, e.g.:
    // { messages: [HumanMessage(userMessage), HumanMessage("This is the Solution")] }
    return result;
}
