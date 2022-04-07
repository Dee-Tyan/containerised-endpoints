export interface UserTransactions {

    reference: string,
    senderAccount: string,
    amount: number
    receiverAccount: string,
    transferDescription?: string,
    createdAt: string

}


export interface UserBalances {

    account: string,
    balance: number,
    createdAt: string
    name ?: string,
    location ?: string
}


