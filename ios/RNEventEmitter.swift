@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {

    public static var emitter: RNEventEmitter!
    public static var hasListeners:Bool = false

    override init() {
        super.init()
        RNEventEmitter.emitter = self
    }

    override open class func requiresMainQueueSetup() -> Bool {
        return true
    }

    open override func startObserving() {
        RNEventEmitter.hasListeners = true
    }

    open override func stopObserving() {
        RNEventEmitter.hasListeners = false
    }

    open override func supportedEvents() -> [String]! {
        return ["providerStateChanged"]
    }

}
