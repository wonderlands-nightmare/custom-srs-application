export interface IListItems {
    ID: number;
    Item: string;
    Readings: string;
    Meanings: string;
    SRSStage: number;
    NextReviewTime: Date;
    MeaningsCorrect: boolean;
    ReadingsCorrect: boolean;
    MeaningsCorrectCount: number;
    ReadingsCorrectCount: number;
}