from manim import *
import numpy as np

class NormalDistributionCurve(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[0, 0.5, 0.1],
            axis_config={"include_tip": True},
            x_axis_config={"numbers_to_include": np.arange(-4, 5, 1)},
            y_axis_config={"numbers_to_include": np.arange(0, 0.6, 0.1)}
        )

        mu = 0
        sigma = 1
        
        curve = axes.plot(
            lambda x: (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma)**2),
            color=BLUE
        )

        labels = axes.get_axis_labels(x_label="x", y_label="P(x)")

        self.play(Create(axes), Write(labels))
        self.play(Create(curve), run_time=2)
        self.wait(2)