import * as Tabs from '@radix-ui/react-tabs'
import { useState } from 'react'

import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'
/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'pending' | 'completed'
  >('all')
  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>

        <div className="pt-10">
          <Tabs.Root defaultValue="tabAll" orientation="vertical">
            <Tabs.List aria-label="tabs example" className="flex gap-2 pb-10 ">
              <Tabs.Trigger
                value="tabAll"
                className={`justify-center gap-2 rounded-full border border-gray-300 px-8 py-2 ${
                  selectedTab === 'all' ? ' bg-gray-700 text-white' : ''
                }`}
                style={{ borderRadius: '9999px' }}
                onClick={() => setSelectedTab('all')}
              >
                All
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tabPending"
                className={`justify-center gap-2 rounded-full border border-gray-300 px-8 py-2 ${
                  selectedTab === 'pending' ? ' bg-gray-700 text-white' : ''
                }`}
                style={{ borderRadius: '9999px' }}
                onClick={() => setSelectedTab('pending')}
              >
                Pending
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tabCompleted"
                className={`justify-center gap-2 rounded-full border border-gray-300 px-8 py-2 ${
                  selectedTab === 'completed' ? ' bg-gray-700 text-white' : ''
                }`}
                style={{ borderRadius: '9999px' }}
                onClick={() => setSelectedTab('completed')}
              >
                Completed
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tabAll">
              <TodoList selectedTab={selectedTab} />
            </Tabs.Content>
            <Tabs.Content value="tabPending">
              <TodoList selectedTab={selectedTab} />
            </Tabs.Content>
            <Tabs.Content value="tabCompleted">
              <TodoList selectedTab={selectedTab} />
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

export default Index
