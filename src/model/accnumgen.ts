

export function accountNumberGenerator(): string{

    let accNumber = ""

    for (let i = 0; i < 11; i++){
        
        let current = Math.floor(Math.random() * 10)
        accNumber += current;
    }

    return accNumber;
}
