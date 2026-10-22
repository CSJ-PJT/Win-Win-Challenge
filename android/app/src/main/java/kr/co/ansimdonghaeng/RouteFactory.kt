package kr.co.ansimdonghaeng

import ai.pleos.playground.navi.data.RouteInfo

/** Named parameters preserve the published SDK's defaults instead of copying an outdated Java constructor. */
object RouteFactory {
    @JvmStatic
    fun sample(): RouteInfo = RouteInfo(
        longitude = 127.03636666,
        latitude = 37.48544722,
        displayLongitude = null,
        displayLatitude = null,
        poiName = "42dot SDK 공식 예제",
        poiId = "36khp37hh8gqcm5nqhe5",
        poiSubId = "0",
        address = "서울시 강남구 남부순환로 2621"
    )
}
