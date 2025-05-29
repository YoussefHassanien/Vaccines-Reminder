import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Cart from "../../models/cartModel.js";
import Product from "../../models/productModel.js";
import CartProduct from "../../models/cartProductModel.js";

/**
 * Validates cart creation request
 */
export const createCartValidator = [
  body("cart").notEmpty().withMessage("Cart data is required"),

  body("cart.paymentType")
    .optional()
    .isIn(["Cash", "Online"])
    .withMessage("Payment type must be either 'Cash' or 'Online'")
    .bail()
    .escape(),

  body("cart.status")
    .optional()
    .equals("Pending")
    .withMessage("Status must be valid")
    .bail()
    .escape(),

  body("cart.governorate")
    .if(body("cart.paymentType").equals("Cash"))
    .notEmpty()
    .withMessage("Governorate is required for cash payment")
    .bail()
    .isLength({ min: 4, max: 30 })
    .withMessage("Governorate must be between 4 and 30 characters")
    .bail()
    .escape(),

  body("cart.city")
    .if(body("cart.paymentType").equals("Cash"))
    .notEmpty()
    .withMessage("City is required for cash payment")
    .bail()
    .isLength({ min: 4, max: 50 })
    .withMessage("City must be between 4 and 50 characters")
    .bail()
    .escape(),

  body("cart.street")
    .if(body("cart.paymentType").equals("Cash"))
    .notEmpty()
    .withMessage("Street is required for cash payment")
    .bail()
    .isLength({ min: 4, max: 100 })
    .withMessage("Street must be between 4 and 100 characters")
    .bail()
    .escape(),

  body("cart.buildingNumber")
    .if(body("cart.paymentType").equals("Cash"))
    .notEmpty()
    .withMessage("Building number is required for cash payment")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer")
    .bail(),

  body("cart.apartmentNumber")
    .if(body("cart.paymentType").equals("Cash"))
    .notEmpty()
    .withMessage("Apartment number is required for cash payment")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Apartment number must be a positive integer")
    .bail(),

  // Check if user already has a pending cart
  body().custom(async (_, { req }) => {
    const userId = req.user._id;
    const existingCart = await Cart.findOne({ userId, status: "Pending" });

    if (existingCart) {
      throw new Error(
        "You already have a pending cart. Please complete or delete it first."
      );
    }
    return true;
  }),

  validatorMiddleware,
];

/**
 * Validates cart product creation (adding product to cart)
 */
export const createCartProductValidator = [
  param("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid cart ID format")
    .bail()
    .custom(async (cartId, { req }) => {
      // Check if cart exists and belongs to user
      const cart = await Cart.findOne({
        _id: cartId,
        userId: req.user._id,
        status: "Pending",
      });

      if (!cart) {
        throw new Error(
          "Cart not found, does not belong to you, or is not in 'Pending' status"
        );
      }

      return true;
    }),

  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID format")
    .bail()
    .custom(async (productId, { req }) => {
      // Check if product exists
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      // Check if product is in stock
      if (product.quantity < 1) {
        throw new Error("Product is out of stock");
      }

      const cartId = req.params.cartId;

      // Check if product is already in cart
      const existingCartProduct = await CartProduct.findOne({
        cartId,
        productId,
      });

      if (existingCartProduct) {
        throw new Error(
          "This product is already in your cart. Use the update quantity endpoint instead."
        );
      }

      return true;
    }),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .bail()
    .custom(async (quantity, { req }) => {
      // Check if there's enough inventory
      const productId = req.body.productId;
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.quantity < quantity) {
        throw new Error(
          `Insufficient inventory. Only ${product.quantity} units available.`
        );
      }
      return true;
    }),

  validatorMiddleware,
];

/**
 * Validates cart product removal request
 */
export const eraseCartProductValidator = [
  param("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid cart ID format")
    .bail()
    .custom(async (cartId, { req }) => {
      // Check if cart exists and belongs to user
      const cart = await Cart.findOne({
        _id: cartId,
        userId: req.user._id,
        status: "Pending",
      });

      if (!cart) {
        throw new Error(
          "Cart not found, does not belong to you, or is not in 'Pending' status"
        );
      }

      return true;
    }),

  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID format")
    .bail()
    .custom(async (productId, { req }) => {
      const cartId = req.params.cartId;

      // Check if product exists in cart
      const cartProduct = await CartProduct.findOne({
        cartId,
        productId,
      });

      if (!cartProduct) {
        throw new Error("Product not found in this cart");
      }

      return true;
    }),

  validatorMiddleware,
];

/**
 * Validates cart product quantity update request
 */
export const modifyCartProductQuantityValidator = [
  param("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid cart ID format")
    .bail()
    .custom(async (cartId, { req }) => {
      // Check if cart exists and belongs to user
      const cart = await Cart.findOne({
        _id: cartId,
        userId: req.user._id,
        status: "Pending",
      });

      if (!cart) {
        throw new Error(
          "Cart not found, does not belong to you, or is not in 'Pending' status"
        );
      }

      return true;
    }),

  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID format")
    .bail()
    .custom(async (productId, { req }) => {
      const cartId = req.params.cartId;

      // Check if product exists in cart
      const cartProduct = await CartProduct.findOne({
        cartId,
        productId,
      });

      if (!cartProduct) {
        throw new Error("Product not found in this cart");
      }

      return true;
    }),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .bail()
    .custom(async (quantity, { req }) => {
      // Get current quantity to calculate difference
      const { cartId, productId } = req.params;
      const cartProduct = await CartProduct.findOne({ cartId, productId });

      if (!cartProduct) {
        throw new Error("Cart product not found!");
      }
      quantity = parseInt(quantity, 10);
      const currentQuantity = parseInt(cartProduct.quantity, 10);

      // Calculate how many more units we need
      const quantityDifference = quantity - currentQuantity;

      // If we're increasing quantity, check inventory
      if (quantityDifference > 0) {
        const product = await Product.findById(productId);

        if (!product) {
          throw new Error("Product not found");
        }

        if (parseInt(product.quantity, 10) < quantityDifference) {
          throw new Error(
            `Insufficient inventory. Only ${product.quantity} additional units available.`
          );
        }
      }

      return true;
    }),

  validatorMiddleware,
];

/**
 * Validates cart deletion request
 */
export const eraseCartValidator = [
  param("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid cart ID format")
    .bail()
    .custom(async (cartId, { req }) => {
      // Check if cart exists and belongs to user
      const cart = await Cart.findOne({
        _id: cartId,
        userId: req.user._id,
      });

      if (!cart) {
        throw new Error("Cart not found or does not belong to you");
      }

      // Check if cart is in a status that allows deletion
      if (cart.status !== "Pending") {
        throw new Error(`Cannot delete cart with status: ${cart.status}`);
      }

      return true;
    }),

  validatorMiddleware,
];

/**
 * Validates cart status modification request
 */
export const modifyCartStatusValidator = [
  param("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid cart ID format")
    .bail()
    .custom(async (cartId, { req }) => {
      // Check if cart exists and belongs to user
      const cart = await Cart.findOne({
        _id: cartId,
        userId: req.user._id,
        status: "Pending",
        paymentType: "Cash",
      });

      if (!cart) {
        throw new Error(
          "Cart not found, does not belong to you, is not in 'Pending' status, or is not a cash payment cart"
        );
      }

      // Check if cart has products
      const cartProducts = await CartProduct.find({ cartId });

      if (!cartProducts || cartProducts.length === 0) {
        throw new Error(
          "Cannot update status of an empty cart. Please add products first."
        );
      }

      return true;
    }),

  validatorMiddleware,
];
