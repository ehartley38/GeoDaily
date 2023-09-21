/*
  Warnings:

  - You are about to drop the column `receiverId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `FriendRequest` table. All the data in the column will be lost.
  - Added the required column `receiverUsername` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUsername` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverUsername" TEXT NOT NULL,
ADD COLUMN     "senderUsername" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderUsername_fkey" FOREIGN KEY ("senderUsername") REFERENCES "UserAccount"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverUsername_fkey" FOREIGN KEY ("receiverUsername") REFERENCES "UserAccount"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
