import React, { useContext } from 'react'
import { Search as SearchIcon } from 'react-feather'

export default function Search({ term, search }: any) {
  return (
    <div className="relative w-full max-w-lg" style={{ maxWidth: '30rem' }}>
      <input
        className="py-3 px-4 rounded-full w-full focus:outline-none"
        style={{ background: '#161522' }}
        onChange={e => search(e.target.value)}
        value={term}
        placeholder="Search by name, symbol, address"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <SearchIcon size={16} />
      </div>
    </div>
  )
}
