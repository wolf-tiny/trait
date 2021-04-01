import React, { useContext } from 'react'
import { Search as SearchIcon } from 'react-feather'

export default function Search({ term, search }: any) {
  return (
    <div className="relative w-full max-w-lg">
      <input
        className="py-3 pl-4 pr-14 rounded-full w-full bg-primary focus:outline-none"
        onChange={e => search(e.target.value)}
        value={term}
        placeholder="Search by name, symbol, address"
      />
      <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
        <SearchIcon size={16} />
      </div>
    </div>
  )
}
