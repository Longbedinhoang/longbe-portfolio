import React from "react";

function SelectedWorksSection() {
  return (
    <section className="selected-works-section" id="works">
      <h2><span className="highlight">SELECTED</span> WORKS</h2>
      <div className="works-grid">
        {/* Thêm ảnh/video vào đây */}
        <div className="work-item empty">
          Ảnh/Video 1
          <span className="work-hover-text">Ảnh/Video 1</span>
        </div>
        <div className="work-item empty">
          Ảnh/Video 2
          <span className="work-hover-text">Ảnh/Video 2</span>
        </div>
        <div className="work-item empty">
          Ảnh/Video 3
          <span className="work-hover-text">Ảnh/Video 3</span>
        </div>
        <div className="work-item empty">
          Ảnh/Video 4
          <span className="work-hover-text">Ảnh/Video 4</span>
        </div>
        <div className="work-item empty">
          Ảnh/Video 5
          <span className="work-hover-text">Ảnh/Video 5</span>
        </div>
        <div className="work-item empty">
          Ảnh/Video 6
          <span className="work-hover-text">Ảnh/Video 6</span>
        </div>
      </div>
    </section>
  );
}

export default SelectedWorksSection;
