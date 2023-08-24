import { ISecret } from './gcsm';

export interface ISecretHandle extends ISecret {
    internal_name: string;
}

export type LabelAlias = { [p: string]: string } | null | undefined
