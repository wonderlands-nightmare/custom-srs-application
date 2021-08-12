export interface IListItems {
    ID: number;
    Item: string;
    Readings: string;
    Meanings: string;
    SRSStage: number;
    Tags: [];
    Nextreviewtime: string;
    MeaningsCorrect: boolean;
    ReadingsCorrect: boolean;
    MeaningsCorrectCount: number;
    ReadingsCorrectCount: number;
}