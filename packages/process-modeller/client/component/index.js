import { BoardModeller } from '@operato/board/dist/src/ox-board-modeller'

import { burner } from './burner'
import { common } from './common'
import { dryer } from './dryer'
import { furnace } from './furnace'
import { hx } from './hx'
import { pump } from './pump'

export function registerProcessGroups() {
  BoardModeller.registerGroup(burner)
  BoardModeller.registerGroup(furnace)
  BoardModeller.registerGroup(dryer)
  BoardModeller.registerGroup(common)
  BoardModeller.registerGroup(pump)
  BoardModeller.registerGroup(hx)
}
