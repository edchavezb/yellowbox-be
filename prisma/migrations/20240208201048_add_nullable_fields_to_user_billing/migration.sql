-- AlterTable
ALTER TABLE "UserBilling" ALTER COLUMN "stripe_customer_id" DROP NOT NULL,
ALTER COLUMN "stripe_subscription_id" DROP NOT NULL,
ALTER COLUMN "stripe_subscription_status" DROP NOT NULL,
ALTER COLUMN "stripe_price_id" DROP NOT NULL,
ALTER COLUMN "stripe_product_id" DROP NOT NULL;
