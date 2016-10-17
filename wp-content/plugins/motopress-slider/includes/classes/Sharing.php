<?php

class MPSLSharing {
	public static $isScriptsStylesEnqueued = false;
	public static $isPreviewPage = false;
	public static $isMPCEEditor = false;
	public static $shortcodeIsRendering = false;

	public static function disableShortcodeRendering() {
		self::$shortcodeIsRendering = true;
	}
	public static function enableShortcodeRendering() {
		self::$shortcodeIsRendering = false;
	}
	public static function isShortcodeRendering() {
		return self::$shortcodeIsRendering;
	}
}