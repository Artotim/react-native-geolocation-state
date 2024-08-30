#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GeolocationState, NSObject)

RCT_EXTERN_METHOD(getGeolocationState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
