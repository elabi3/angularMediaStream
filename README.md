# MediaStream

This project contains a demo of how to use MediaStream API in an Angular App. Working on Desktop, mobile & tablet. 

# How to run 

```
git clone https://github.com/elabi3/angularMediaStream.git
npm run install
npm run start
```

Live preview: https://elabi3.github.io/angularMediaStream/

# Using it on your project

Copy this folder https://github.com/elabi3/angularMediaStream/tree/main/src/app/mediaStream

Use the directive in a video tag:

```html
<video mediaStream></video>
```

And call the methods from the component

```typescript
ViewChild(MediaStreamDirective)
public mediaStream: MediaStreamDirective;

this.mediaStream.play(); // play video from camera
```