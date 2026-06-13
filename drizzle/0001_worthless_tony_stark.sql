CREATE TABLE `worldcup_fan_pick` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_email` text DEFAULT '' NOT NULL,
	`match_slug` text NOT NULL,
	`pick` text NOT NULL,
	`predicted_score` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reward_credits` integer DEFAULT 0 NOT NULL,
	`reward_reason` text DEFAULT '' NOT NULL,
	`card_title` text DEFAULT '' NOT NULL,
	`card_theme` text DEFAULT '' NOT NULL,
	`settled_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_worldcup_fan_pick_user` ON `worldcup_fan_pick` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_worldcup_fan_pick_match` ON `worldcup_fan_pick` (`match_slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_worldcup_fan_pick_user_match` ON `worldcup_fan_pick` (`user_id`,`match_slug`);