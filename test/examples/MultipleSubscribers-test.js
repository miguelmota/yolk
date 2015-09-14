/** @jsx createElement */

const {createElement, createEventHandler, render} = Yolk

function CounterWithMultipleSubscribers (props) {
  const handlePlus = createEventHandler(() => 1, 0)
  const handleMinus = createEventHandler(() => -1, 0)
  const count = handlePlus.merge(handleMinus).scan((x, y) => x+y, 0)

  return (
    <div>
      <button id="plus" onClick={handlePlus}>+</button>
      <button id="minus" onClick={handleMinus}>-</button>
      <span>{count}</span>
      <span>{count}</span>
      <span>{props.count}</span>
      <span>{props.count}</span>
    </div>
  )
}

describe(`A simple counter`, () => {

  it(`can have multiple subscribers listening to the same source`, () => {
    let component = <CounterWithMultipleSubscribers count={55} />
    const node = document.createElement(`div`)
    render(component, node)

    assert.equal(node.innerHTML, `<div><button id="plus">+</button><button id="minus">-</button><span>0</span><span>0</span><span>55</span><span>55</span></div>`)

    const plus = node.querySelector(`#plus`)
    const minus = node.querySelector(`#minus`)

    plus.click()
    plus.click()
    plus.click()
    minus.click()

    component = <CounterWithMultipleSubscribers count={77} />
    render(component, node)

    assert.equal(node.innerHTML, `<div><button id="plus">+</button><button id="minus">-</button><span>2</span><span>2</span><span>77</span><span>77</span></div>`)
  })

})