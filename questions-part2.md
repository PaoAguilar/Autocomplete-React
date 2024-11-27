## Questions - Part 2

**1. What is the difference between Component and PureComponent?
Give an example where it might break my app.**

PureComponents are components that doesn't do any rerender even if the props, parents or another values has changed.
This could be a problem if you want to see some changes reflected on them after a change in the state of the
application,
but it can be a good option if you have multiple nested structures.

**2. Context + ShouldComponentUpdate might be dangerous. Why is
that?**

On react class components you can use ShouldComponentUpdate to control the component to do a render. But we may
encounter the case where the component has a shouldComponentUpdate that returns false and this will
prevent changes in the state from being propagated correctly and that includes context propagation.

**3. Describe 3 ways to pass information from a component to its
PARENT.**

1. Through a function that is passed by props from the parent component.
```
const ParentComponent = () => {
  const {name, setName} = useState();
  const getName = (name) => {
    setName(name)
  }
  return (
    <>
      <MyChildrenComponent getColor={getName} />
    </>
  )
}
```
2. Move the state to the parent and passed the state and the setter to the children as 2 props.

```
const ParentComponent = () => {
  const {name, setName} = useState();

  return (
    <>
      <MyChildrenComponent setName={setName} name={name} />
    </>
  )
}
```
3. Using context instead of props for passing down data. We can store in context any information from the children
   component and get access to that information from another children consuming the context provider.

**4. Give 2 ways to prevent components from re-rendering.**

1. Using React.memo will prevent re renders from prop changes unless we specify the opposite.
2. With PureComponents we can prevent any re render

**5. What is a fragment and why do we need it? Give an example where it might break my app.**

Fragment `<></>` is a way to group multiple elements and it is used because the JSX of react expects only one element,
so we can't return for example `return(<div></div><div></div> )`, instead we can encapsulate everything into a `<div>`
but we would be adding an unnecessary element to the DOM, so for that we can use fragment and don't add useless html
elements.

**6. Give 3 examples of the HOC pattern.**

A high order component is a component that receives another component and contains logic to apply to the component that
we are passing as parameter

1. To use the same logic in multiple components, for example an authentication to send information to other components

```
export default withAuthentication(MyOtherComponent);
```

2. We can have compose high order component, we can have two different functionalities in two hoc.

```
withAuth(
  withStyle(MyOtherComponent)
);
```

**7. What's the difference in handling exceptions in promises, callbacks and async...await?**

The difference is the complexity they have. For example with callbacks you have to propagate the error by passing
parameters to the function and if the callbacks are nested can be hard to manage. Promises can throw errors on `throw()`
or `reject()` and propagate the error into a `.catch()`. And for async await it uses try catch blocks to simple access
to the error.

**8. How many arguments does setState take and why is it async.**

Using useState the setState takes one argument that can be the value you want to set or a function that gets the
previous value as
a parameter.
And if you are using class componets it takes an object for values as an argument and also a callback function that is
call after the state has changed.
And finally, the setState is async because it has to wait that the changes has been made to do a rerender of the
component.

**9. List the steps needed to migrate a Class to Function Component.**

First we need to know what's the functionality of that component we want to migrate to keep the same functionality after
the refactor. Then start refactoring for example the setState to useState hook and also the callbacks to useEffect.
After the refactor make sure that the component is still working the same way as before.

**10. List a few ways styles can be used with components.**

We can style a component by doing an in line styling using javascript objects with CSS as key property, we can also work
with CSS files and build some classes, also with processors like SASS.
We can also use CSS in javascript with libraries like Material UI or Styled-Components, and also we can use CSS
frameworks like taildwind.

**11. How to render an HTML string coming from the server.**

To render HTML from the server you can use `dangerouslySetInnerHTML`, this is a dangerous operation because you don't
wanna parse code that can be manipulated from the server, so you have to be care full.
