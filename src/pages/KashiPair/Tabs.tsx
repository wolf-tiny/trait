import React from 'react'
import { useDarkModeManager } from '../../state/user/hooks'

interface Tab {
  id: string
  title: string
}

interface TabsProps {
  tabs: Tab[]
  selected: string
  setSelected: (id: string) => void
}

const Tabs = ({ tabs, selected, setSelected }: TabsProps) => {
  const [darkMode] = useDarkModeManager()
  return (
    <div className="-mb-px flex space-x-4" aria-label="Tabs">
      {tabs.map((tab: any) => {
        return (
          <button
            key={tab.id}
            onClick={() => {
              setSelected(tab.id)
            }}
            className={
              `${
                selected === tab.id
                  ? `${darkMode ? 'text-white hover:text-white' : 'text-white hover:text-gray-600'}`
                  : `${darkMode ? 'text-gray-600 hover:text-gray-700' : 'text-gray-400 hover:text-gray-700'}`
              }` +
              ' border-transparent whitespace-nowrap py-2 px-1 font-medium text-base focus:outline-none font-semibold'
            }
          >
            {tab.title}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
