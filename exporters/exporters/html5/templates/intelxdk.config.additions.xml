<!-- Change the debuggable preference to true to build a remote CDT debuggable app for -->
<!-- Crosswalk apps on Android 4.0+ devices and Cordova apps on Android 4.4+ devices. -->
<preference name="debuggable" value="false" />
<!-- IMPORTANT: set the debuggable preference to false before you build for the store! -->

<platform name="ios">
    <!-- below requires the splash screen plugin, otherwise ignored -->
    <!-- docs: https://github.com/apache/cordova-plugin-splashscreen -->
    <preference name="AutoHideSplashScreen" value="true" />
    <preference name="FadeSplashScreen" value="false"/>
    <preference name="FadeSplashScreenDuration" value="2"/>
    <preference name="ShowSplashScreenSpinner" value="false"/>

    <!-- below requires the status bar plugin, otherwise ignored -->
    <!-- docs: https://github.com/apache/cordova-plugin-statusbar -->
    <!-- see http://devgirl.org/2014/07/31/phonegap-developers-guid -->
    <preference name="StatusBarOverlaysWebView" value="false" />
    <preference name="StatusBarBackgroundColor" value="#000000" />
    <preference name="StatusBarStyle" value="lightcontent" />
</platform>

<platform name="android">
    <!-- below requires the splash screen plugin, otherwise ignored -->
    <!-- docs: https://github.com/apache/cordova-plugin-splashscreen -->
    <!-- 'value' = number of milliseconds to display the splash screen in a Cordova build. -->
    <!-- <preference name="SplashScreenDelay" value="2000" /> -->
    <!-- <preference name="SplashMaintainAspectRatio" value="false" /> -->
</platform>

<!-- use this feature to add command-lines to be used by Crosswalk builds on device -->
<!-- see http://peter.sh/experiments/chromium-command-line-switches/ for complete list -->
<intelxdk:crosswalk xwalk-command-line="--disable-pull-to-refresh-effect" />
<!-- ignore gpu blacklist for larger collection of gpu accelerated devices -->
<intelxdk:crosswalk xwalk-command-line="--ignore-gpu-blacklist" />

<!-- controls configuration of Crosswalk-Android "SurfaceView" or "TextureView" -->
<!-- see Sep 15 comments in https://crosswalk-project.org/jira/browse/XWALK-2233 -->
<!-- default is SurfaceView if >= CW15 and TextureView if <= CW14 -->
<!-- option can only be used with Intel XDK CLI5+ build systems -->
<!-- SurfaceView is preferred, TextureView should only be used in special cases -->
<!-- enable Crosswalk-Android TextureView by setting option to true -->
<preference name="CrosswalkAnimatable" value="false" />
