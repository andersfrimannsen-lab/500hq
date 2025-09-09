// Native PWA notification handler - Pure local experience
// This script handles service worker messages for a truly native app experience

// Listen for messages from the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
      console.log('Notification clicked - bringing app to foreground:', event.data);
      
      const notificationTag = event.data.notificationTag;
      const action = event.data.action;
      
      try {
        // Ensure the app is visible and focused
        if (action === 'bring_to_foreground') {
          console.log('Bringing app to foreground...');
          
          // Focus the window
          if (window.focus) {
            window.focus();
          }
          
          // Ensure the app is not hidden
          if (document.hidden) {
            // Try to bring the document to the foreground
            document.addEventListener('visibilitychange', function onVisible() {
              if (!document.hidden) {
                document.removeEventListener('visibilitychange', onVisible);
                window.focus();
              }
            }, { once: true });
          }
          
          // Handle specific notification types
          if (notificationTag === 'audio-player-notification') {
            console.log('Audio player notification clicked - focusing on music player');
            
            // Find and focus the audio player element
            const audioPlayer = document.querySelector('[data-audio-player]') || 
                               document.querySelector('audio') ||
                               document.querySelector('[class*="audio"]') ||
                               document.querySelector('[class*="player"]');
            
            if (audioPlayer) {
              audioPlayer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
              
              // If it's an audio element, ensure it's visible
              if (audioPlayer.tagName === 'AUDIO') {
                const playerContainer = audioPlayer.closest('[class*="player"]') || 
                                      audioPlayer.closest('[class*="audio"]') ||
                                      audioPlayer.parentElement;
                if (playerContainer) {
                  playerContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  });
                }
              }
            } else {
              // Fallback: scroll to top to show the main interface
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else if (notificationTag === 'daily-quote-notification') {
            console.log('Daily quote notification clicked - showing main content');
            
            // Scroll to top to show the main quote
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Try to focus on the main quote element
            const quoteElement = document.querySelector('[class*="quote"]') ||
                               document.querySelector('main') ||
                               document.querySelector('#root > div');
            
            if (quoteElement) {
              quoteElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          } else {
            // Default: just ensure we're at the top of the app
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          
          // Vibrate to give feedback (if supported)
          if ('vibrate' in navigator) {
            navigator.vibrate(100);
          }
        }
      } catch (error) {
        console.error('Error handling notification click:', error);
        // Fallback: just focus the window
        if (window.focus) {
          window.focus();
        }
      }
    }
  });
}

// Enhanced service worker registration for native app experience
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered for native PWA experience:', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available - native app will update');
              // For a native app experience, we can silently update
              // or show a subtle notification
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Native app focus utilities
function ensureNativeAppFocus() {
  console.log('Ensuring native app focus...');
  
  // Bring the app to the foreground
  if (window.focus) {
    window.focus();
  }
  
  // Handle visibility changes for mobile
  if (document.hidden) {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('App became visible - ensuring focus');
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.focus();
        
        // Scroll to ensure content is visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Timeout fallback
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, 5000);
  }
  
  // For mobile devices, try to prevent the browser from going to background
  if ('wakeLock' in navigator) {
    // Request a screen wake lock to keep the app active (if supported)
    navigator.wakeLock.request('screen').catch(err => {
      console.log('Wake lock not available:', err);
    });
  }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing native PWA experience...');
  registerServiceWorker();
});

// Also initialize if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerServiceWorker);
} else {
  registerServiceWorker();
}

// Handle page visibility changes to maintain native app behavior
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('App became visible - maintaining native experience');
    ensureNativeAppFocus();
  }
});

// Export for use in your main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerServiceWorker,
    ensureNativeAppFocus
  };
}

