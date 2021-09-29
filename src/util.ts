import { WithId, Match } from './types'
import { ELO_INITIAL_RATING, ELO_K_FACTOR } from './config'

const WL_PRECISION = 2

export const displayWinLossRatio = (wins: number, losses: number): string => {
  if (losses === 0 && wins === 0) return (0).toFixed(WL_PRECISION)
  if (losses === 0) return (1).toFixed(WL_PRECISION)
  return (wins / losses).toFixed(WL_PRECISION)
}

export const findCompetingMatches = (
  matches: WithId<Match>[],
  playerId: string
): WithId<Match>[] =>
  matches.filter((match) =>
    [match.playerA.id, match.playerB.id].includes(playerId)
  )

export const calculatePlayerScoreFromMatch = (
  match: Match,
  playerId: string
): number => {
  const totalScoreA = match.sets.reduce((sum, set) => set.scoreA + sum, 0)
  const totalScoreB = match.sets.reduce((sum, set) => set.scoreB + sum, 0)

  const isPlayerA = match.playerA.id === playerId
  return isPlayerA ? totalScoreA : totalScoreB
}

export const findWinningMatches = (
  matches: WithId<Match>[],
  playerId: string
): WithId<Match>[] => {
  const competingMatches = findCompetingMatches(matches, playerId)
  return competingMatches.filter((match) => {
    const score = calculatePlayerScoreFromMatch(match, playerId)

    const isPlayerA = match.playerA.id === playerId
    const opposerId = isPlayerA ? match.playerB.id : match.playerA.id
    const opposerScore = calculatePlayerScoreFromMatch(match, opposerId)

    return score > opposerScore
  })
}

export const calculateMadeShots = (
  matches: WithId<Match>[],
  playerId: string
): number => {
  const competingMatches = findCompetingMatches(matches, playerId)
  return competingMatches.reduce(
    (sum, match) => sum + calculatePlayerScoreFromMatch(match, playerId),
    0
  )
}

export const calculateConcededShots = (
  matches: WithId<Match>[],
  playerId: string
): number => {
  const competingMatches = findCompetingMatches(matches, playerId)
  return competingMatches.reduce((sum, match) => {
    const opponentId =
      match.playerA.id === playerId ? match.playerB.id : match.playerA.id
    return sum + calculatePlayerScoreFromMatch(match, opponentId)
  }, 0)
}

export const calculateAverageGoalDifferential = (
  matches: WithId<Match>[],
  playerId: string
): number => {
  const competingMatches = findCompetingMatches(matches, playerId)

  if (competingMatches.length === 0) return 0

  const differentialSum = competingMatches.reduce((sum, match) => {
    const opponentId = (
      playerId === match.playerA.id ? match.playerB : match.playerA
    ).id
    const differential =
      calculatePlayerScoreFromMatch(match, playerId) -
      calculatePlayerScoreFromMatch(match, opponentId)
    return sum + differential
  }, 0)
  return differentialSum / competingMatches.length
}

export const sortMatches = (matches: Match[]) => {
  return matches.sort(
    (a, b) =>
      a.date.toDate().getMilliseconds() - b.date.toDate().getMilliseconds()
  )
}

export interface EloChange {
  matchId: string
  playerId: string
  eloChange: number
  date: Date
}

export interface PlayerEloPair {
  playerId: string
  elo: number
}

export interface EloCalculationResults {
  playerEloPairs: PlayerEloPair[]
  eloChanges: EloChange[]
}

export const calculateElo = (
  matches: WithId<Match>[]
): EloCalculationResults => {
  // Always make sure matches are sorted first
  matches = matches.sort((a, b) => a.date.toMillis() - b.date.toMillis())

  const playerEloPairs: PlayerEloPair[] = []
  const eloChanges: EloChange[] = []

  const findPlayerEloPair = (playerId: string): PlayerEloPair => {
    let playerEloPair = playerEloPairs.find(
      (pair) => pair.playerId === playerId
    )

    if (!playerEloPair) {
      playerEloPair = { playerId, elo: ELO_INITIAL_RATING }
      playerEloPairs.push(playerEloPair)
    }

    return playerEloPair
  }

  for (const match of matches) {
    const qa = 10 ** (findPlayerEloPair(match.playerA.id).elo / 400)
    const qb = 10 ** (findPlayerEloPair(match.playerB.id).elo / 400)

    for (const isPlayerA of [true, false]) {
      const playerId = (isPlayerA ? match.playerA : match.playerB).id
      const opponentId = (isPlayerA ? match.playerB : match.playerA).id

      const q = isPlayerA ? qa : qb

      const expectedScore = q / (qa + qb)

      const points = calculatePlayerScoreFromMatch(match, playerId)
      const opponentPoints = calculatePlayerScoreFromMatch(match, opponentId)

      const score = points / (points + opponentPoints)

      const initialEloPair = findPlayerEloPair(playerId)
      const eloChange = ELO_K_FACTOR * (score - expectedScore)
      initialEloPair.elo += eloChange

      eloChanges.push({
        matchId: match.id,
        playerId,
        eloChange,
        date: match.date.toDate(),
      })
    }
  }

  return { playerEloPairs, eloChanges }
}

export const findTopEloChangePlayer = (
  eloChanges: EloChange[],
  findGainer: boolean
): string | null => {
  if (eloChanges.length === 0) return null

  const changesSum: Record<string, number> = {}
  eloChanges.forEach((change) => {
    if (!changesSum[change.playerId]) {
      changesSum[change.playerId] = 0
    }

    changesSum[change.playerId] += change.eloChange
  })

  let topChangerId = eloChanges[0].playerId
  let topChangerChange = eloChanges[0].eloChange

  for (const [playerId, eloChange] of Object.entries(changesSum)) {
    if (
      (findGainer && eloChange > topChangerChange) ||
      (!findGainer && eloChange < topChangerChange)
    ) {
      topChangerId = playerId
      topChangerChange = eloChange
    }
  }

  return topChangerId
}

export const isSameDate = (a: Date, b: Date): boolean =>
  a.toDateString() === b.toDateString()

export const calculateWinStreak = (
  matches: Match[],
  playerId: string
): number => {
  // Most recent matches first
  const sortedMatches = matches
    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
    .filter((match) => [match.playerA.id, match.playerB.id].includes(playerId))

  let streak = 0
  for (const match of sortedMatches) {
    const opponentId =
      match.playerA.id === playerId ? match.playerB.id : match.playerA.id
    const score = calculatePlayerScoreFromMatch(match, playerId)
    const opponentScore = calculatePlayerScoreFromMatch(match, opponentId)
    const didWin = score >= opponentScore

    if (!didWin) {
      return streak
    }

    streak++
  }

  return streak
}
