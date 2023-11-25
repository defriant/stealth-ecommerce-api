import mongoose from 'mongoose'
import Cart, { TCart } from '../models/Cart'
import { TransactionFees } from '../models/Transaction'

export const createSummarize = async (cart_ids: string[], user_id: string) => {
    // check duplicate entries of cart_ids
    const duplicateCartIds = cart_ids.filter((_id, i) => cart_ids.indexOf(_id) !== i)
    if (duplicateCartIds.length > 0) throw { message: 'Duplicate cart_ids detected', errors: duplicateCartIds }

    // meassure each card_ids is valid id
    const invalidCartIds: string[] = []
    cart_ids.forEach(_id => {
        if (!mongoose.Types.ObjectId.isValid(_id)) invalidCartIds.push(`Invalid id ${_id}`)
    })
    if (invalidCartIds.length > 0) throw { message: 'Cart not found', errors: invalidCartIds }

    // select user cart based on given cart_ids, and validate if cart exist
    const invalidCarts: string[] = []
    const carts = await Promise.all(
        cart_ids.map(async _id => {
            const cart = (await Cart.findOne({ _id, user: user_id })
                .populate('product', ['-description', '-createdAt', '-updatedAt'])
                .select(['-createdAt', '-updatedAt'])) as TCart

            // filter if there's any cart is not found and push into invalidCart array
            if (!cart) invalidCarts.push(`Cart with id ${_id} not found`)
            return cart
        }),
    )

    // throw error if any invalid cart
    if (invalidCarts.length > 0) throw { message: 'Cart not found', errors: invalidCarts }

    // validate product stock and calculate total
    let total: number = 0
    const insufficientStock: string[] = []
    carts.forEach(c => {
        if (c.product.stock < c.quantity)
            insufficientStock.push(`${c.product.name} ${c.product.stock} remaining in stock, order amount ${c.quantity}`)

        total += c.product.price * c.quantity
    })

    const fees = TransactionFees
    let grand_total: number = total

    // calculate grand total and transaction fees
    fees.forEach(fee => (grand_total += fee.cost))

    // If all product stocks are sufficient, users can checkout transactions
    const checkout_availability = {
        is_available: insufficientStock.length === 0,
        notes: insufficientStock.length === 0 ? ['All product stocks are sufficient'] : insufficientStock,
    }

    return {
        carts,
        total,
        fees,
        grand_total,
        checkout_availability,
    }
}
