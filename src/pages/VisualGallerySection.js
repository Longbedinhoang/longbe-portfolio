import React from "react";

function VisualGallerySection() {
  return (
    <section className="visual-gallery-section" id="visual-gallery">
      <h2><span className="highlight">VISUAL</span> GALLERY</h2>
      <div className="gallery-grid">
        {/* Thêm ảnh gallery vào đây */}
        <div className="gallery-item empty">Ảnh 1</div>
        <div className="gallery-item empty">Ảnh 2</div>
        <div className="gallery-item empty">Ảnh 3</div>
        <div className="gallery-item empty">Ảnh 4</div>
        <div className="gallery-item empty">Ảnh 5</div>
        <div className="gallery-item empty">Ảnh 6</div>
      </div>
    </section>
  );
}

export default VisualGallerySection;
