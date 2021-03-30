import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="https://assets.stickpng.com/images/5a4e2ef62da5ad73df7efe6e.png"
          height={200}
          style={{ marginBottom: 10 }}
        />
        <Circle color="#382b2c" size={60} />
      </div>
    </center>
  );
}

export default Loading;
