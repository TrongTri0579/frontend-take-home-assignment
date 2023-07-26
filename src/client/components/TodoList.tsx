import type { SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
import { useState, useEffect, useRef } from 'react'
import autoAnimate, { getTransitionSizes } from '@formkit/auto-animate'

import { api } from '@/utils/client/api'

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

export const TodoList = ({
  selectedTab,
}: {
  selectedTab: 'all' | 'pending' | 'completed'
}) => {
  const { data: todos = [], refetch: refetchTodos } = api.todo.getAll.useQuery({
    statuses: selectedTab === 'all' ? ['pending', 'completed'] : [selectedTab],
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const updateTodoStatusMutation = api.todoStatus.update.useMutation()
  const deleteTodoMutation = api.todo.delete.useMutation()

  // const fakeCompletedTodo = {
  //   id: 1000,
  //   body: 'This is a completed todo',
  //   status: 'completed',
  // }
  // const fakeCompletedTodo2 = {
  //   id: 1001,
  //   body: 'This is a completed todo 2',
  //   status: 'completed',
  // }

  // const todosWithFakeCompleted = [
  //   ...todos,
  //   fakeCompletedTodo,
  //   fakeCompletedTodo2,
  // ]
  const handleTodoStatusChange = async (
    todoId: number,
    status: 'completed' | 'pending'
  ) => {
    try {
      setIsUpdating(true)
      await updateTodoStatusMutation.mutateAsync({
        todoId: todoId,
        status: status,
      })
      setIsUpdating(false)

      refetchTodos()
    } catch (error) {
      setIsUpdating(false)
      // Handle error if needed
      // console.error('Update todo status failed:', error)
    }
  }

  const handleTodoDelete = async (todoId: number) => {
    try {
      setIsUpdating(true)
      await deleteTodoMutation.mutateAsync({
        id: todoId,
      })
      setIsUpdating(false)

      refetchTodos()
    } catch (error) {
      setIsUpdating(false)
      // Handle error if needed
      // console.error('Delete todo failed:', error)
    }
  }

  const parentElementRef = useRef(null)
  useEffect(() => {
    // Call autoAnimate with the bouncy logic inside the useEffect hook
    if (parentElementRef.current) {
      autoAnimate(
        parentElementRef.current,
        (el, action, oldCoords, newCoords) => {
          let keyframes: Keyframe[] | PropertyIndexedKeyframes | null = null
          // supply a different set of keyframes for each action
          if (action === 'add') {
            keyframes = [
              { transform: 'scale(0)', opacity: 0 },
              { transform: 'scale(1.15)', opacity: 1, offset: 0.75 },
              { transform: 'scale(1)', opacity: 1 },
            ]
          }
          // keyframes can have as many "steps" as you prefer
          // and you can use the 'offset' key to tune the timing
          if (action === 'remove') {
            keyframes = [
              { transform: 'scale(1)', opacity: 1 },
              { transform: 'scale(1.15)', opacity: 1, offset: 0.33 },
              { transform: 'scale(0.75)', opacity: 0.1, offset: 0.5 },
              { transform: 'scale(0.5)', opacity: 0 },
            ]
          }
          if (action === 'remain' && oldCoords && newCoords) {
            // for items that remain, calculate the delta
            // from their old position to their new position
            const deltaX = oldCoords.left - newCoords.left
            const deltaY = oldCoords.top - newCoords.top
            // use the getTransitionSizes() helper function to
            // get the old and new widths of the elements
            const [widthFrom, widthTo, heightFrom, heightTo] =
              getTransitionSizes(el, oldCoords, newCoords)
            // set up our steps with our positioning keyframes
            const start: Keyframe = {
              transform: `translate(${deltaX}px, ${deltaY}px)`,
            }
            const mid: Keyframe = {
              transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`,
              offset: 0.75,
            }
            const end: Keyframe = { transform: `translate(0, 0)` }
            // if the dimensions changed, animate them too.
            if (widthFrom !== undefined && widthTo !== undefined) {
              start.width = `${widthFrom}px`
              mid.width = `${
                widthFrom >= widthTo ? widthTo / 1.05 : widthTo * 1.05
              }px`
              end.width = `${widthTo}px`
            }
            if (heightFrom !== undefined && heightTo !== undefined) {
              start.height = `${heightFrom}px`
              mid.height = `${
                heightFrom >= heightTo ? heightTo / 1.05 : heightTo * 1.05
              }px`
              end.height = `${heightTo}px`
            }
            keyframes = [start, mid, end]
          }
          // return our KeyframeEffect() and pass
          // it the chosen keyframes.
          return new KeyframeEffect(el, keyframes, {
            duration: 600,
            easing: 'ease-out',
          })
        }
      )
    }
  }, [])

  return (
    <ul className="grid grid-cols-1 gap-y-3" ref={parentElementRef}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <div className="flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm">
            <Checkbox.Root
              id={String(todo.id)}
              className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
              checked={todo.status === 'completed'}
              onChange={() => {
                if (!isUpdating) {
                  handleTodoStatusChange(
                    todo.id,
                    todo.status === 'completed' ? 'pending' : 'completed'
                  )
                }
              }}
            >
              <Checkbox.Indicator>
                {todo.status === 'completed' ? (
                  <CheckIcon className="h-4 w-4 text-white" />
                ) : null}
              </Checkbox.Indicator>
            </Checkbox.Root>

            <label
              className={`${
                todo.status === 'completed' ? 'line-through' : ''
              } block pl-3 font-medium`}
              htmlFor={String(todo.id)}
            >
              {todo.body}
            </label>
            <div
              className="text-red-500 ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
              onClick={() => handleTodoDelete(todo.id)}
            >
              <XMarkIcon className="h-4 w-4" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
