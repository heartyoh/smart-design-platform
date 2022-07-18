import { BoardModeller } from '@operato/board/ox-board-modeller.js'

import { combuster } from './combuster'
import { common } from './common'
import { dryer } from './dryer'
import { etc } from './etc'
import { furnace } from './furnace'
import { hx } from './hx'
import { postTr } from './post-tr'
import { pump } from './pump'

export function registerProcessGroups() {
  BoardModeller.registerGroup(combuster)
  BoardModeller.registerGroup(furnace)
  BoardModeller.registerGroup(dryer)
  BoardModeller.registerGroup(common)
  BoardModeller.registerGroup(pump)
  BoardModeller.registerGroup(hx)
  BoardModeller.registerGroup(postTr)

  BoardModeller.registerGroup(etc)
}
