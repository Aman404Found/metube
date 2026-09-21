# MeTube Backend — Comprehensive Project Analysis & Evaluation Report

---

## 1. Executive Summary

**Project Name:** MeTube (chai-backend)  
**Author:** Aman  
**Tech Stack:** Node.js, Express.js (v5), MongoDB, Mongoose (v9), Cloudinary, Multer, JWT, Bcrypt  
**Evaluation Date:** September 2026  
**Repository Branch:** `chai-backend`

This report provides an in-depth code audit, competency assessment, feature tracking matrix, and technical evaluation of the MeTube backend codebase. MeTube is designed as an enterprise-grade, production-structured video hosting backend mimicking core YouTube functionality.

---

## 2. Project Rating & Scorecard

### Overall Rating: **5.2 / 10** *(Current State)*  
*(With all bugs fixed and pending controllers completed, the architecture qualifies for **9.2 / 10** as a portfolio project)*.

### Dimension Scorecard

| Evaluation Dimension | Score | Status | Key Highlights & Observations |
| :--- | :---: | :---: | :--- |
| **Architectural Design & Structure** | **7.5 / 10** | 🟢 Strong | Clean separation of concerns (MVC-like pattern), centralized utility wrappers (`ApiError`, `ApiResponse`, `asyncHandler`), dedicated router and middleware layers. |
| **Concepts & Modern Practices** | **7.0 / 10** | 🟢 Solid | ES Modules, dual-token authentication (Access + Refresh JWTs), bcrypt salting/hashing, complex MongoDB aggregation pipelines, cloud asset offloading. |
| **Feature Completion** | **3.5 / 10** | 🟡 Partial | User module is ~85% complete, Playlist & Subscription are ~70% complete, Healthcheck is 100%. Video, Like, Comment, Tweet, and Dashboard controllers are 0% (only boilerplate TODOs). |
| **Code Correctness & Stability** | **2.5 / 10** | 🔴 Critical | The server currently **cannot start** due to import/export mismatches and syntax errors. Once booted, several runtime crashes exist (unimported modules, missing `new` keywords, swapped route params). |
| **Security & Authorization** | **4.5 / 10** | 🟡 Needs Work | Solid password hashing and JWT validation. However, resource ownership authorization is missing on playlists (any logged-in user can delete or modify other users' playlists), and HTTP `Authorization` header has a spelling bug. |
| **Cloud Storage & Asset Lifecycle** | **4.0 / 10** | 🟡 Incomplete | Multer saves files locally to `./public/temp`, but uploaded files are never deleted on successful Cloudinary upload (causing server storage leak). No Cloudinary deletion helper for obsolete avatars/videos. |

---

## 3. What You Have Learned So Far (Skills Acquired)

Your work across the commits demonstrates that you have absorbed substantial backend and full-stack engineering fundamentals. Below is the breakdown of competencies you have successfully gained:

### 1. Modern Node.js & Express Architecture
- **ES Modules (`import/export`)**: Transitioned from legacy CommonJS `require()` to native ESM.
- **Middleware Pipeline**: Configured CORS with credentials, URL-encoded parsers, JSON body parsers with payload size limits (`16kb`) to mitigate Denial of Service (DoS) attacks, static file serving, and cookie parsing.
- **Higher-Order Functions**: Mastered `asyncHandler` wrapping to avoid tedious `try/catch` boilerplate across controllers and propagate errors directly to Express error listeners.
- **Standardized API Contracts**: Implemented uniform response structures using `ApiResponse` and custom error propagation via subclasses of JavaScript's `Error` (`ApiError`).

### 2. Authentication, Cryptography & Session Management
- **Password Hashing & Salting**: Implemented Mongoose pre-save hooks (`userSchema.pre("save")`) with `bcrypt` to hash passwords before saving, with modification checks (`this.isModified("password")`).
- **Cryptographic Verification**: Added custom schema methods (`userSchema.methods.isPasswordCorrect`) for timing-safe password comparisons.
- **Dual-Token JWT Strategy**:
  - Implemented short-lived **Access Tokens** for stateless, authorized API requests.
  - Implemented long-lived **Refresh Tokens** stored in the database for secure session renewal.
  - Implemented HTTP-Only and Secure cookie handling (`httpOnly: true, secure: true`).
  - Implemented Token Refresh rotation endpoint (`/refresh-token`).

### 3. Data Modeling & Database Design with Mongoose
- **Schema Design & Validation**: Structured schemas with unique constraints, auto-trimming, indexing, and timestamps.
- **Document Relationships**: Modelled one-to-many and many-to-many relationships using `Schema.Types.ObjectId` references (`ref: "User"`, `ref: "Video"`).
- **Pagination Plugins**: Integrated `mongoose-aggregate-paginate-v2` for aggregation-based pagination.

### 4. Advanced MongoDB Aggregation Pipelines
*(One of the hardest topics in MongoDB backend development)*
- Built complex multi-stage pipelines using:
  - `$match`: Filtering by user ID and usernames.
  - `$lookup`: Performing SQL-style relational joins across collections (e.g., joining `subscriptions` and `videos` into user documents).
  - Sub-pipeline `$lookup`: Performing nested lookups (e.g., joining the video owner profile inside `watchHistory`).
  - `$addFields`: Dynamically computing document metrics (such as `subscribersCount` and `channelsSubscribedToCount` using `$size`).
  - `$cond` and `$in`: Conditional boolean flags (e.g., calculating `isSubscribed` based on whether the viewing user ID exists in the channel subscribers array).
  - `$project`: Strict projection to exclude sensitive credentials (passwords, refresh tokens) before returning data.

### 5. File Uploads & Third-Party Cloud Integration
- **Multer Middleware**: Configured `diskStorage` to handle `multipart/form-data`, allocating temporary file paths in `./public/temp`.
- **Cloudinary SDK**: Implemented automated media offloading to Cloudinary CDN using `cloudinary.uploader.upload`.

---

## 4. Complete Status of All Flows (Feature Matrix)

| Flow / Endpoint Group | Routes Defined | Controller Status | Working Today? | Notes & Remaining Tasks |
| :--- | :---: | :---: | :---: | :--- |
| **Healthcheck** (`/api/v1/healthcheck`) | 100% | 100% Complete | ⚠️ Blocked by startup crash | Simple, clean liveness check endpoint. |
| **User: Register & Login** | 100% | 90% Complete | ⚠️ Blocked by startup crash | Functional; needs local temp file cleanup on success. |
| **User: Token Refresh & Auth** | 100% | 95% Complete | ⚠️ Blocked by startup crash | Good JWT verification; header typo in middleware. |
| **User: Profile & Watch History** | 100% | 70% Complete | 🔴 Crashes at runtime | Aggregation in `getWatchHistory` has unimported `mongoose` and `$addField` typo. |
| **User: Avatars & Cover Images** | 100% | 75% Complete | 🔴 Crash on import | Typo in export name (`updataUserAvatar`); does not delete old cloud asset. |
| **Playlists: CRUD & Video Links** | 100% | 65% Complete | 🔴 Crashes at runtime | Missing `new` on `ObjectId`; missing ownership authorization checks. |
| **Subscriptions: Toggle & Lists** | 100% | 60% Complete | 🔴 Crashes at runtime | Route parameters are swapped; missing `new` on `ObjectId`; self-subscription unchecked. |
| **Videos: Publishing & Management** | 100% | 0% (Empty TODOs) | 🔴 Non-functional | Contains 6 empty controller stubs; broken import in controller. |
| **Likes: Videos, Comments, Tweets** | 100% | 0% (Empty TODOs) | 🔴 Non-functional | Contains 4 empty controller stubs. |
| **Comments: CRUD & Video Threads** | 100% | 0% (Empty TODOs) | 🔴 Non-functional | Contains 4 empty controller stubs. |
| **Tweets: Mini-feed & CRUD** | 100% | 0% (Empty TODOs) | 🔴 Non-functional | Contains 4 empty controller stubs. |
| **Dashboard: Stats & Channel Videos** | 100% | 0% (Empty TODOs) | 🔴 Non-functional | Contains 2 empty controller stubs. |
| **Global Error Handling** | 0% | 0% Missing | 🔴 Leaks HTML/raw errors | No Express error-handling middleware (`(err, req, res, next)`) registered in `app.js`. |

---

## 5. Critical Flaws, Bugs & Blockers (Detailed Technical Audit)

This section documents every bug currently in the codebase, categorized by severity.

### 🔴 Category 1: Fatal Startup Blockers (The App Does Not Boot)

#### 1. Missing Database Module Import in `src/index.js`
- **Location:** [src/index.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/index.js#L3)
- **Code:**
  ```javascript
  import connectDB from "./db/index.js";
  ```
- **Error:** Node.js throws:
  `Cannot find module '.../src/db/index.js' imported from .../src/index.js`
- **Root Cause:** The database file is located at `src/db/db.js`, but `src/index.js` imports `./db/index.js`.
- **Fix:** Change line 3 to `import connectDB from "./db/db.js";` (or rename `db.js` to `index.js`).

#### 2. Typo in User Controller Export Name
- **Location:** [src/controllers/user.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/user.controller.js#L467-L468) vs [src/routes/user.routes.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/routes/user.routes.js#L9-L10)
- **Code:**
  - Controller exports: `updataUserAvatar`, `updataUserCoverImage` (typo: "updata")
  - Router imports: `updateUserAvatar`, `updateUserCoverImage`
- **Error:** Node.js throws:
  `SyntaxError: The requested module '../controllers/user.controller.js' does not provide an export named 'updateUserAvatar'`
- **Fix:** Rename `updataUserAvatar` -> `updateUserAvatar` and `updataUserCoverImage` -> `updateUserCoverImage` in both declaration and exports.

#### 3. Broken Cloudinary Import in `video.controller.js`
- **Location:** [src/controllers/video.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/video.controller.js#L7)
- **Code:**
  ```javascript
  import {uploadOnCloudinary} from "../utils/cloudinary.js"
  ```
- **Error:** `cloudinary.js` exports `{ uploadCloudinary }`. Importing `{ uploadOnCloudinary }` throws a `SyntaxError`.
- **Fix:** Align the import to `import { uploadCloudinary } from "../utils/cloudinary.js"`.

---

### 🔴 Category 2: Runtime Crash Bugs (Triggers on API Requests)

#### 4. Missing `mongoose` Import in `user.controller.js`
- **Location:** [src/controllers/user.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/user.controller.js#L412)
- **Code:**
  ```javascript
  _id: new mongoose.Types.ObjectId(req.user._id)
  ```
- **Error:** `mongoose` is not imported anywhere in `user.controller.js`. When `/api/v1/users/history` is requested, it throws:
  `ReferenceError: mongoose is not defined`
- **Fix:** Add `import mongoose from "mongoose";` at the top of `user.controller.js`.

#### 5. Invalid MongoDB Aggregation Stage Name (`$addField` vs `$addFields`)
- **Location:** [src/controllers/user.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/user.controller.js#L437)
- **Code:**
  ```javascript
  $addField: {
    owner: { $first: "$owner" }
  }
  ```
- **Error:** MongoDB pipeline throws:
  `MongoServerError: Unrecognized pipeline stage name: '$addField'`
- **Fix:** Change `$addField` to `$addFields` (plural).

#### 6. Missing `new` Keyword on `ObjectId` Constructor in Mongoose 9
- **Locations:**
  - [src/controllers/playlist.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/playlist.controller.js#L59) (`owner: mongoose.Types.ObjectId(userId)`)
  - [src/controllers/playlist.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/playlist.controller.js#L91) (`_id: mongoose.Types.ObjectId(playlistId)`)
  - [src/controllers/subscription.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/subscription.controller.js#L52) (`channel: mongoose.Types.ObjectId(channelId)`)
  - [src/controllers/subscription.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/subscription.controller.js#L96) (`subscriber: mongoose.Types.ObjectId(subscriberId)`)
- **Error:** In modern Mongoose (v6+ through v9), `ObjectId` is an ES6 class:
  `TypeError: Class constructor ObjectId cannot be invoked without 'new'`
- **Fix:** Always use `new mongoose.Types.ObjectId(...)`.

#### 7. Swapped Handlers in Subscription Routes
- **Location:** [src/routes/subscription.routes.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/routes/subscription.routes.js#L13-L17)
- **Code:**
  ```javascript
  router.route("/c/:channelId")
    .get(getSubscribedChannels) // WRONG: Expects subscriberId
    .post(toggleSubscription);

  router.route("/u/:subscriberId")
    .get(getUserChannelSubscribers); // WRONG: Expects channelId
  ```
- **Error:**
  - Requesting `/c/:channelId` gives `req.params.channelId`, but `getSubscribedChannels` looks for `req.params.subscriberId` (which is `undefined`).
  - Requesting `/u/:subscriberId` gives `req.params.subscriberId`, but `getUserChannelSubscribers` looks for `req.params.channelId` (which is `undefined`).
  - Both endpoints always fail with `400 "not valid subscriber"` or `400 "not valid channel"`.
- **Fix:** Swap the handlers to match their parameters:
  ```javascript
  router.route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

  router.route("/u/:subscriberId")
    .get(getSubscribedChannels);
  ```

---

### 🟡 Category 3: Security & Authorization Flaws

#### 8. Missing Ownership Verification in Playlist Mutations
- **Location:** [src/controllers/playlist.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/playlist.controller.js#L114-L214)
- **Flaw:**
  In `addVideoToPlaylist`, `removeVideoFromPlaylist`, `deletePlaylist`, and `updatePlaylist`, there is no check comparing `playlist.owner` with `req.user._id`:
  ```javascript
  // Any logged-in user can delete another user's playlist by passing playlistId
  await Playlist.findByIdAndDelete(playlistId);
  ```
- **Fix:** Check ownership before any mutation:
  ```javascript
  if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You do not have permission to modify this playlist");
  }
  ```

#### 9. Spelling Typo in Authorization Header
- **Location:** [src/middlewares/auth.middleware.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/middlewares/auth.middleware.js#L7)
- **Code:**
  ```javascript
  const token = req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ","");
  ```
- **Flaw:** Standard HTTP header is `Authorization` (spelled with `z`). Clients, Postman, mobile apps, or frontend clients passing standard `Authorization` headers will be rejected if cookies are not set.
- **Fix:**
  ```javascript
  const token = req.cookies?.accessToken || 
    req.header("Authorization")?.replace("Bearer ", "") || 
    req.header("Authorisation")?.replace("Bearer ", "");
  ```

#### 10. Self-Subscription Logic & Channel Verification
- **Location:** [src/controllers/subscription.controller.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/controllers/subscription.controller.js#L9-L39)
- **Flaw:**
  - A user can subscribe to their own channel (`channelId === req.user._id.toString()`).
  - No database check verifies whether `channelId` is an existing user before inserting a subscription record.

---

### 🟡 Category 4: Resource Leaks & Performance Flaws

#### 11. Local Temporary Files Never Cleaned on Successful Upload
- **Location:** [src/utils/cloudinary.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/utils/cloudinary.js#L17-L28)
- **Flaw:**
  ```javascript
  const response = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
  return response; // <-- Local file is NOT unlinked here!
  ```
  `fs.unlinkSync(filePath)` is only present inside the `catch` block. When uploads succeed, local files in `./public/temp` remain on the disk permanently, causing storage exhaustion in production.
- **Fix:** Add `fs.unlinkSync(filePath)` in a `finally` block or right before `return response`.

#### 12. Missing Cloudinary Cleanup / Deletion Utility
- When users update their avatar or cover image, the old Cloudinary image is not deleted. Cloud storage usage will continuously inflate with orphaned media assets.
- **Fix:** Implement `deleteFromCloudinary(publicId, resourceType)` using `cloudinary.uploader.destroy`.

#### 13. Missing Compound Unique Indexes in Subscriptions and Likes
- Multiple concurrent requests can result in duplicate subscriptions or duplicate likes in the database.
- **Fix:** Add schema-level compound indexes:
  ```javascript
  subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });
  likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, sparse: true });
  ```

#### 14. Missing Global Error Middleware
- **Location:** [src/app.js](file:///c:/Users/ashwa/Downloads/Telegram%20Desktop/Backend%20Buy%20Chai%20Code-OOG/src/app.js)
- **Flaw:** When an `ApiError` is thrown, Express falls back to its default HTML error handler. Clients receive HTML stack traces instead of JSON `{ success: false, message: ... }`.
- **Fix:** Add a terminal error handler at the end of `app.js`:
  ```javascript
  app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      return res.status(statusCode).json({
          statusCode,
          success: false,
          message: err.message || "Internal Server Error",
          errors: err.errors || []
      });
  });
  ```

---

## 6. What Flows Are Still Present (Remaining Work to Implement)

To complete the MeTube project, the following modules need full controller implementations:

### 1. Video Flow (`video.controller.js`)
- `publishAVideo`: Handle multer upload for video file and thumbnail, upload both to Cloudinary, calculate video duration, create DB record.
- `getVideoById`: Increment view count, populate video owner details, return video data.
- `getAllVideos`: Dynamic search/filter aggregation using `$match` (title/description regex), filter by `userId`, sort by `views`, `createdAt`, `duration`, with `mongooseAggregatePaginate`.
- `updateVideo`: Update title, description, or upload new thumbnail (deleting old thumbnail from Cloudinary).
- `deleteVideo`: Verify ownership, delete video document, and remove both video and thumbnail from Cloudinary.
- `togglePublishStatus`: Invert `isPublished` boolean flag.

### 2. Like Flow (`like.controller.js`)
- `toggleVideoLike`: Toggle like record for video (`{ video: videoId, likedBy: req.user._id }`).
- `toggleCommentLike`: Toggle like record for comment (`{ comment: commentId, likedBy: req.user._id }`).
- `toggleTweetLike`: Toggle like record for tweet (`{ tweet: tweetId, likedBy: req.user._id }`).
- `getLikedVideos`: Aggregation pipeline to fetch all videos liked by current user with populated owner details.

### 3. Comment Flow (`comment.controller.js`)
- `getVideoComments`: Paginated comments for a video using aggregation, with commenter avatar and full name populated.
- `addComment`: Create a comment document tied to `videoId` and `req.user._id`.
- `updateComment`: Ownership check + update comment content.
- `deleteComment`: Ownership check (or video owner check) + delete comment document.

### 4. Tweet Flow (`tweet.controller.js`)
- `createTweet`: Post new tweet text with `req.user._id`.
- `getUserTweets`: Fetch tweets posted by a specific `userId`.
- `updateTweet`: Ownership check + update text.
- `deleteTweet`: Ownership check + delete tweet.

### 5. Dashboard Flow (`dashboard.controller.js`)
- `getChannelStats`: Aggregation pipeline computing:
  - Total video views.
  - Total subscribers count.
  - Total videos count.
  - Total likes across all videos of this channel.
- `getChannelVideos`: Fetch all videos uploaded by the authenticated channel with publish status and stats.

---

## 7. Actionable Roadmap to Achieve a 10 / 10 Score

Follow this prioritized roadmap to bring your project to a production-ready, portfolio-grade standard:

```
[Phase 1: Zero-Bug Foundation]
       │
       ├── Fix startup import errors (index.js & user.controller.js exports)
       ├── Fix runtime bugs (mongoose imports, $addFields, new ObjectId)
       ├── Fix subscription route swapping
       └── Register global JSON error middleware in app.js
       │
[Phase 2: Security & Hygiene]
       │
       ├── Add playlist ownership authorization checks
       ├── Add unlinkSync to Cloudinary successful upload flow
       ├── Implement Cloudinary delete helper
       └── Add compound unique indexes to Subscriptions & Likes
       │
[Phase 3: Core Features]
       │
       ├── Implement Video Controller (Publish, Get, Paginated Search)
       ├── Implement Like Controller (Toggle Likes & Liked Videos)
       ├── Implement Comment Controller (Paginated Comments & CRUD)
       └── Implement Tweet & Dashboard Controllers
       │
[Phase 4: Production Polish]
       │
       ├── Add Request Validation (e.g. Zod or Joi schemas)
       ├── Add API Rate Limiting (express-rate-limit)
       └── Write Postman/Thunder Client Integration Test Suite
```

---

## 8. Senior Mentor's Conclusion & Verdict

You have picked up the foundational principles of scalable backend engineering remarkably well:
1. You understand **clean code structure** (models, views/routes, controllers, and utilities).
2. You have tackled **MongoDB Aggregation Pipelines**, which many junior engineers avoid.
3. You implemented **secure JWT access/refresh token rotation**, which is industry best practice.

The current lower score (**5.2/10**) is solely due to incomplete controllers and syntax/naming bugs that currently prevent the server from starting. Once you apply the fixes detailed in Section 5 and complete the remaining controllers in Section 6, this project will easily stand at **9+ / 10** as an impressive showcase piece for any backend engineering role.
