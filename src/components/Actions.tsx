import {Component, createMemo, For} from "solid-js";
import {produce} from "solid-js/store";
import {useLevel} from "../context/Level";
import {calculateStack, Color, gameStore, InstructionType} from "../store";
import {makeArray} from "../utils";
import InstructionSymbol from "./InstructionSymbol";

const Actions: Component = () => {
  const { level } = useLevel()

  const [state, setState] = gameStore

  const fnRows = createMemo(() => {
    const n = Math.ceil(level().functions.length / 3)
    return makeArray(n)
  })

  const setCurrentInstruction = (type: InstructionType, fnIndex?: number, paintColor?: Color, condColor?: Color) => {
    const { game: { selectedInstruct: { fnIndex: fni, instructIndex } } } = state

    if (type === InstructionType.COND_COLOR) {
      setState(produce(s => {
        const existing = s.game.functions[fni][instructIndex]
        const newCondColor = condColor === existing.condColor ? undefined : condColor
        s.game.functions[fni][instructIndex] = {
          ...existing, condColor: newCondColor
        }
      }))
    } else {
      setState(produce(s => {
        const existing = s.game.functions[fni][instructIndex]
        s.game.functions[fni][instructIndex] = {
          type, fnIndex, paintColor,
          condColor: existing.condColor
        }
      }))
    }

    calculateStack(setState)
  }

  return (
    <div>
      <div class="action-row">
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.PASS)}>
          <InstructionSymbol type={InstructionType.PASS} />
        </button>
      </div>
      <div class="action-row">
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.ROT_L)}>
          <InstructionSymbol type={InstructionType.ROT_L} />
        </button>
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.FORWARD)}>
          <InstructionSymbol type={InstructionType.FORWARD} />
        </button>
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.ROT_R)}>
          <InstructionSymbol type={InstructionType.ROT_R} />
        </button>
      </div>
      <For each={fnRows()}>
        {i => (
          <div>
            <button
              class="action-btn"
              disabled={i*3+1 > level().functions.length}
              onClick={() => setCurrentInstruction(InstructionType.CALL_FN, i*3)}
            >
              <InstructionSymbol type={InstructionType.CALL_FN} fnIndex={i*3} />
            </button>
            <button
              class="action-btn"
              disabled={i*3+2 > level().functions.length}
              onClick={() => setCurrentInstruction(InstructionType.CALL_FN, i*3+1)}
            >
              <InstructionSymbol type={InstructionType.CALL_FN} fnIndex={i*3+1} />
            </button>
            <button
              class="action-btn"
              disabled={i*3+3 > level().functions.length}
              onClick={() => setCurrentInstruction(InstructionType.CALL_FN, i*3+2)}
            >
              <InstructionSymbol type={InstructionType.CALL_FN} fnIndex={i*3+2} />
            </button>
          </div>
        )}
      </For>
      <div class="action-row">
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.PAINT_COLOR, undefined, "RED")}>
          <InstructionSymbol type={InstructionType.PAINT_COLOR} paintColor="RED" />
        </button>
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.PAINT_COLOR, undefined, "BLUE")}>
          <InstructionSymbol type={InstructionType.PAINT_COLOR} paintColor="BLUE" />
        </button>
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.PAINT_COLOR, undefined, "GREEN")}>
          <InstructionSymbol type={InstructionType.PAINT_COLOR} paintColor="GREEN" />
        </button>
      </div>
      <div class="action-row">
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.COND_COLOR, undefined, undefined, "RED")}>
          <InstructionSymbol type={InstructionType.COND_COLOR} condColor="RED" />
        </button>
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.COND_COLOR, undefined, undefined, "BLUE")}>
          <InstructionSymbol type={InstructionType.COND_COLOR} condColor="BLUE" />
        </button>
        <button class="action-btn" onClick={() => setCurrentInstruction(InstructionType.COND_COLOR, undefined, undefined, "GREEN")}>
          <InstructionSymbol type={InstructionType.COND_COLOR} condColor="GREEN" />
        </button>
      </div>
      <div class="action-row">
      </div>
    </div>
  )
}

export default Actions
