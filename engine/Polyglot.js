import {Book} from "cm-polyglot/lib/stakelbase/Book.js"
import {KeyGenerator} from "cm-polyglot/lib/stakelbase/KeyGenerator.js"
import { Platform } from 'react-native';

export class Polyglot {

    constructor(url) {
        // const bookEntry = new BookEntry()
        this.book = new Book(require('./gm2001.json').result);
        this.keyGenerator = new KeyGenerator()
    }
    entryToMove(bookEntry) {
        const move = {
            from: undefined,
            to: undefined,
            promotion: undefined
        }
        const files = "abcdefgh"
        const promoPieces = " nbrq"

        move.from = files[bookEntry.get_from_col()]
        move.from = "" + move.from + (bookEntry.get_from_row() + 1)
        move.to = files[bookEntry.get_to_col()]
        move.to = "" + move.to + (bookEntry.get_to_row() + 1)

        if (bookEntry.get_promo_piece() > 0) {
            move.promotion = promoPieces[bookEntry.get_promo_piece()]
        }
        // special castling moves notation in polyglot, see http://hgm.nubati.net/book_format.html
        if(bookEntry.isOOW()) {
            move.to = "g1"
        } else if(bookEntry.isOOOW()) {
            move.to = "c1"
        } else if(bookEntry.isOOB()) {
            move.to = "g8"
        } else if(bookEntry.isOOOB()) {
            move.to = "c8"
        }
        move.weight = bookEntry.weight
        return move
    }

    async getMovesFromFen(fen, weightPower = 0.2) {
        return new Promise((resolve) => {
                const hash = this.keyGenerator.compute_fen_hash(fen)
                const bookEntries = this.book.get_all_moves(hash)
                const moves = []
                let weightSum = 0
                for (const bookEntry of bookEntries) {
                    moves.push(this.entryToMove(bookEntry))
                    weightSum += bookEntry.weight
                }
                // calculate probability  http://hgm.nubati.net/book_format.html
                for (const move of moves) {
                    move.probability = Math.pow(move.weight / weightSum, weightPower)
                        .toFixed(1)
                }
                resolve(moves)
        })
    }
}