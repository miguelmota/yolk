/** @jsx createElement */

const Rx = require(`rx`)
const createElement = require(`createElement`)
const eventHandler = require(`eventHandler`)
const render = require(`render`)

function NestedObservableProps (props) {
  const height = props.map(p => `${p.height}px`)
  const width =  props.map(p => `${p.width}px`)
  const style = {color: `blue`, height, width}

  return <div style={style} />
}

function DeeplyNestedObservableProps (props) {
  const content = props.map(p => p.a.b.c.d)

  return <div>{content}</div>
}

describe(`nested observable props`, () => {
  it(`properly interpret properties`, () => {
    const heightSubject = new Rx.BehaviorSubject(1)
    const widthSubject = new Rx.BehaviorSubject(1)
    const component = <NestedObservableProps height={heightSubject} width={widthSubject} />
    const node = document.createElement(`div`)
    render(component, node)

    assert.equal(node.innerHTML, `<div style="color: blue; height: 1px; width: 1px;"></div>`)

    heightSubject.onNext(50)

    assert.equal(node.innerHTML, `<div style="color: blue; height: 50px; width: 1px;"></div>`)

    widthSubject.onNext(25)

    assert.equal(node.innerHTML, `<div style="color: blue; height: 50px; width: 25px;"></div>`)
  })

  it(`works with doubley nested observables`, () => {
    const deeplyNestedHeightSubject = new Rx.BehaviorSubject(1)
    const nestedHeightSubject = new Rx.BehaviorSubject(deeplyNestedHeightSubject.asObservable())
    const heightSubject = new Rx.BehaviorSubject(nestedHeightSubject.asObservable())
    const component = <NestedObservableProps height={heightSubject} width={1} />
    const node = document.createElement(`div`)
    render(component, node)

    assert.equal(node.innerHTML, `<div style="color: blue; height: 1px; width: 1px;"></div>`)

    deeplyNestedHeightSubject.onNext(44)

    assert.equal(node.innerHTML, `<div style="color: blue; height: 44px; width: 1px;"></div>`)
  })

  it(`works with plain objects that use nested props`, () => {
    const b = new Rx.BehaviorSubject({
        c: {
          d: [new Rx.BehaviorSubject(`hello`), ` goodbye!`]
        }
      })

    const a = {b}

    const component = <DeeplyNestedObservableProps a={a} />
    const node = document.createElement(`div`)
    render(component, node)

    assert.equal(node.innerHTML, `<div>hello goodbye!</div>`)

    b.onNext({
      c: {
        d: <span>Random Component</span>
      }
    })

    assert.equal(node.innerHTML, `<div><span>Random Component</span></div>`)

  })
})