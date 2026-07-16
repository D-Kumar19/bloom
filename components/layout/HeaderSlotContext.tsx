'use client'

import { createContext, type Dispatch, type ReactNode, type SetStateAction } from 'react'

export const HeaderSlotContext = createContext<Dispatch<SetStateAction<ReactNode>> | null>(
  null,
)
