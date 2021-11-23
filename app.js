class customSlider extends HTMLElement
{
    constructor()
    {
        super();
        this.min = parseFloat(this.getAttribute("min")) || 0;
        this.max = parseFloat(this.getAttribute("max")) || 100;
        this.step  = parseFloat(this.getAttribute("step")) || 1;
        this.value = parseFloat(this.getAttribute("value")) || this.max / 2;
        this.appearance = this.getAttribute("appearance") || "basic";

        this.style.minWidth = "12rem";
        this.style.minHeight = "1rem";
        this.style.position = "relative";
        
        this.root = this.attachShadow({mode:"open"})

        this.dragging = false;

        this.create();
        this.update();
    }

    create()
    {
        let slider = document.createElement("input");
        let sliderContainer = document.createElement("div");
        let sliderTrack = document.createElement("div");

        // Create link tag
        let style = document.createElement("link");
        style.rel = "stylesheet";

        // Set Properties
        slider.type = "range";
        slider.id = "slider";
        slider.setAttribute("min", this.min);
        slider.setAttribute("max", this.max);
        slider.step = this.step;
        slider.value = this.value;

        sliderContainer.id = "slider-container";
        sliderTrack.id = "slider-track";

        // Add Event Listeners
        slider.addEventListener("input", this.update.bind(this))
        slider.addEventListener("mousewheel", this.mouseWheelAction.bind(this))

        // Append Elements
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(sliderTrack);

        this.root.appendChild(style);
        this.root.appendChild(sliderContainer);

        if (this.appearance == "basic")
        {
            let value = document.createElement("div");

            style.href = "static/css/custom-slider.css";

            value.id = "value";

            sliderContainer.appendChild(value);

        } else if (this.appearance == "simple") {
            style.href = "static/css/simple.css";
        } else if (this.appearance == "simple-thumb") {
            style.href = "static/css/simple-thumb.css";
        } else if (this.appearance == "combined") {
            let value = document.createElement("div");

            style.href = "static/css/combined.css";

            value.setAttribute("class", "value");
            sliderTrack.appendChild(value);

            let val = this.root.querySelector(".value");
            slider.addEventListener("mousedown", () => {
                val.classList.add("value-up");
            });
            slider.addEventListener("mouseup", () => {
                val.classList.remove("value-up");
            })
        } else if (this.appearance == "basic-range") {
            let valueOuter = document.createElement("div");
            let valueInner = document.createElement("div");

            style.href = "static/css/basic-range.css";

            valueInner.setAttribute("class", "value-inner");
            valueOuter.setAttribute("class", "value-outer");
            valueOuter.appendChild(valueInner);

            sliderContainer.appendChild(valueOuter);

            for(let i = this.min; i < this.max+1; i++)
            {
                let div = document.createElement("div");
                div.innerText = i;
                valueInner.appendChild(div);
            }
        }
    }

    mouseWheelAction(e)
    {
        let target = e.target;
        let targetValue = parseFloat(target.value);
        let scale = Math.min(Math.max(-this.step, e.deltaY * (this.step*-0.01)), this.step);
        targetValue += scale;
        target.value = targetValue;
        this.update();
    }

    update()
    {
        let track = this.root.getElementById("slider-container");
        let slider = this.root.getElementById("slider");
        let valuePercentage = slider.value / (this.max - this.min);

        if(this.appearance == "basic")
        {
            let value = this.root.getElementById("value");
            value.innerText = slider.value;
        } else if (this.appearance == "combined") {
            let value = this.root.querySelector(".value");
            value.innerText = slider.value;
        } else if (this.appearance == "basic-range") {
            let valueInner = this.root.querySelector(".value-inner");
            valueInner.style.marginTop = slider.value / 1 * -30 + "px";
        }
        
        track.style.setProperty("--value", valuePercentage);
    }
}

customElements.define('custom-slider', customSlider);