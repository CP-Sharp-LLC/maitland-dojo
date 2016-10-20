<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'maitlanddojo');

/** MySQL database username */
define('DB_USER', 'maitlanddojo');

/** MySQL database password */
define('DB_PASSWORD', 'MDJ);

/** MySQL hostname */
define('DB_HOST', 'MDJ');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'PFK@0zc-ukcy3j5m%]`X;Cok_)o$|QYeU^ #r30]w#<)v/LT|~Iq`0e;Gi?@S`.Q');
define('SECURE_AUTH_KEY',  ';Yv86i_YQ4~`7Atht1?<%Z+PeYyJ?B3T,R,7q+I[6Lhav_8CK[~]C4aZ(._TN:=R');
define('LOGGED_IN_KEY',    'p`pbcb^Y+pZ-BI$ITFZ8,u|8}77$Ar`c04(-jQDV(-yZ#fY3(>{tBM`s06)^#4Uz');
define('NONCE_KEY',        '#aaic8apdr9`Ws}yfYaMty~j;J5IXPh1>S^xPH%yTZ=L[MnYXtn>jt#?4ly6%4a!');
define('AUTH_SALT',        '(;6p@tWnF%9ShI`UG<-Epu3O@!IqdU_$n$Bw,AlaU`Hc#Eo7gCJVk~OICKnEtI$z');
define('SECURE_AUTH_SALT', '&BMNC)+qZY*~OT9$ge>R|vN,;+.^@9PduLyM.(c25B:vGQ145xi1/0xTqZ5=!,pZ');
define('LOGGED_IN_SALT',   '!bs[n@g-R/[;CBSW|{oT&yScu^($i/mUsf%&dVUVJs#|gr4E;0m3/]}v)>K~2qdp');
define('NONCE_SALT',       'N^Um0O9<9R&;6quFFKu[{{,[:Gh5/aCq(,:~X>Lp^uV%7?LC5rC^7RN623YK`gk%');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wpdev_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
