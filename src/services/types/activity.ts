export type Activity = {
    id: string
    start_latlng: [number, number]
    end_latlng: [number, number]
    type: string
    start_date: string
    commute: boolean
    name: string
    distance: number
}

export type ActivityEnhanced = Activity & {
    potentialCommute: boolean
}

