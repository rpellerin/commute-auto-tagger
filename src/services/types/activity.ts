export type Activity = {
    id: string
    start_latlng: [number, number]
    end_latlng: [number, number]
    start_date: string
    commute: boolean
    name: string
    distance: number
    type: string
}

export type ActivityEnhanced = Activity & {
    potentialCommute: boolean
}

